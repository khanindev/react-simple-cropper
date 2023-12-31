import React, { FC, HTMLAttributes, ReactChild } from 'react';
import styles from './cropper.module.scss';
export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
  children?: ReactChild;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<Props> = ({ children }) => {
  return <div className={"thing"}>{children || `the snozzberries taste like snozzberries`}</div>;
};

type Position = {
  top: number,
  left: number,
}

export type CropperProps = {
  src: string,
  position: Position,
  ratio: number,
  onChangeEnd: (position: Position) => void
}

export enum ImageType {
    horizontal = "horizontal",
    vertical = "vertical"
}

export const Cropper: FC<CropperProps> = ({ src, position, ratio = 1, onChangeEnd }) => {
    const imageContainerRef = React.useRef<HTMLDivElement>();
    const imageRef = React.useRef<HTMLImageElement>();

    const [imageType, setImageType] = React.useState<ImageType | null>(null)
    const [isDragging, setIsDtagging] = React.useState(false)
    const [startPosition, setStartPosition] = React.useState({ left: 0, top: 0 })
    const [completedPosition, setCompletedPosition] = React.useState({ left: 0, top: 0 })
    const [bounding, setBounding] = React.useState({ width: 0, height: 0 })

    React.useEffect(() => {
        setImageType(null)
        setStartPosition({ left: 0, top: 0})
        setCompletedPosition({ left: 0, top: 0})
        setBounding({ width: 0, height: 0})
    }, [src])

    React.useEffect(() => {
        onChangeEnd(position)
    }, [position])

    React.useEffect(() => {
        const listener = (e) => {
            console.log(e)

            const diffTop = completedPosition.top + e.clientY - startPosition.top
            const diffLeft = completedPosition.left + e.clientX - startPosition.left

            console.log("movement", {
                top: diffTop,
                left: diffLeft
            })


            if (diffTop > bounding.height / 2 && diffTop < bounding.height / 2 * -1) {
                imageContainerRef.current?.style.setProperty('--top', `${diffTop}px`);
            } else {
                // TODO-me: Перенести в отдельную функцию =)
                if (diffTop < bounding.height / 2 * -1) {
                    imageContainerRef.current?.style.setProperty('--top', `${bounding.height / 2}px`);
                } else {
                    imageContainerRef.current?.style.setProperty('--top', `${bounding.height / 2 * -1}px`);
                }
            }

            if (diffLeft > bounding.width / 2 && diffLeft < bounding.width / 2 * -1) {
                imageContainerRef.current?.style.setProperty('--left', `${diffLeft}px`);
            } else {
                // TODO-me: Перенести в отдельную функцию =)
                if (diffLeft < bounding.width / 2 * -1) {
                    imageContainerRef.current?.style.setProperty('--left', `${bounding.width / 2}px`);
                } else {
                    imageContainerRef.current?.style.setProperty('--left', `${bounding.width / 2 * -1}px`);
                }
            }
        }

        const mouseUpListener = (e) => {
            let topPosition = completedPosition.top + e.clientY - startPosition.top
            let leftPosition = completedPosition.left + e.clientX - startPosition.left


            // TODO-me: Перенести в отдельную функцию =)
            if (topPosition <= bounding.height / 2 || topPosition >= bounding.height / 2 * -1) {
                if (topPosition < bounding.height / 2 * -1) {
                    topPosition = bounding.height / 2
                } else if (topPosition > bounding.height / 2) {
                    topPosition = bounding.height / 2 * -1
                }
            }


            // TODO-me: Перенести в отдельную функцию =)
            if (leftPosition <= bounding.width / 2 || leftPosition >= bounding.width / 2 * -1) {
                if (leftPosition <= bounding.width / 2 * -1) {
                    leftPosition = bounding.width / 2
                } else {
                    leftPosition = bounding.width / 2 * -1
                }
            }

            setCompletedPosition({
                top: topPosition,
                left: leftPosition
            })

            setIsDtagging(false)
        }


        if (isDragging) {
            window.addEventListener("mousemove", listener)
            window.addEventListener("touchmove", listener)
            window.addEventListener("mouseup", mouseUpListener)
            window.addEventListener("touchend", mouseUpListener)
        }

        return () => {
            window.removeEventListener("mousemove", listener)
            window.removeEventListener("mouseup", mouseUpListener)
            window.removeEventListener("mouseup", mouseUpListener)
            window.removeEventListener("touchend", mouseUpListener)
        }
    }, [isDragging])

    const handleMouseDown = (e) => {
        console.log(e)
        setStartPosition({ left: e.clientX, top: e.clientY })
        console.log("startPosition", startPosition)
        setIsDtagging(true)
    }

    const calcBounding = (containerRef: any, imageSize: any) => {
        const { width: containerWidth, height: containerHeight } = containerRef.current?.getBoundingClientRect()

        return {
            width: containerWidth - imageSize.width,
            height: containerHeight - imageSize.height
        }
    }

    const getImageType = ({ width, height }: any): ImageType => {
        if (width / height < ratio) return ImageType.vertical
        return  ImageType.horizontal
    }

    const handleImageLoad = (e: any) => {
        const { width, height } = e.target.getBoundingClientRect()
        setImageType(getImageType({ width, height }))
    }

    React.useEffect(() => {
        setStartPosition({
            top: 0,
            left: 0,
        })

        setCompletedPosition({
            top: 0,
            left: 0,
        })

        setBounding({
            width: 0,
            height: 0
        })

        imageContainerRef.current?.style.setProperty('--top', `${0}px`);
        imageContainerRef.current?.style.setProperty('--left', `${0}px`);
    }, [src])

    React.useLayoutEffect(() => {
        const { width: boundingWidth, height: boundingHeight } = calcBounding(imageContainerRef, imageRef.current?.getBoundingClientRect())
        setBounding({
            width: boundingWidth,
            height: boundingHeight
        })
    }, [imageType])

  return (
      <React.Fragment>
          <div className={styles["root"]}
               onTouchStart={(e) => handleMouseDown(e)}
               onMouseDown={(e) => handleMouseDown(e)}
          >
              <div className={styles["draggable-container"]}>
                <div className={styles["image-container"]} ref={imageContainerRef}>
                  <img draggable={false}
                       ref={imageRef}
                       onLoad={(e) => handleImageLoad(e)}
                       src={src}
                       alt={src}
                       className={[styles["image"], styles[imageType as string]].join(" ")}
                  />
                </div>
              </div>
          </div>
          { JSON.stringify(bounding, null, 2)}
          { JSON.stringify(position, null, 2)}
          { JSON.stringify(imageType, null, 2)}
      </React.Fragment>
  )
}

