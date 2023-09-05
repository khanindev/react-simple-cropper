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
  onChangeEnd: (position: Position) => void
}

export const Cropper: FC<CropperProps> = ({ src, position, onChangeEnd }) => {

    const imageContainerRef = React.useRef<HTMLDivElement>();

    const [isDragging, setIsDtagging] = React.useState(false)
    const [startPosition, setStartPosition] = React.useState({ left: 0, top: 0 })
    const [completedPosition, setCompletedPosition] = React.useState({ left: 0, top: 0 })
    const [bounding, setBounding] = React.useState({ width: 0, height: 0 })

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
                imageContainerRef.current?.style.setProperty('--top', `${0}px`);
            }

            if (diffLeft > bounding.width / 2 && diffLeft < bounding.width / 2 * -1) {
                imageContainerRef.current?.style.setProperty('--left', `${diffLeft}px`);
            } else {
                if (diffLeft < bounding.width / 2 * -1) {
                    imageContainerRef.current?.style.setProperty('--left', `${bounding.width / 2}px`);
                } else {
                    imageContainerRef.current?.style.setProperty('--left', `${bounding.width / 2 * -1}px`);
                }
            }
        }

        const mouseUpListener = (e) => {
            setCompletedPosition({
                top: completedPosition.top + e.clientY - startPosition.top,
                left: completedPosition.left +e.clientX - startPosition.left
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

    const handleImageLoad = (e: any) => {
        const { width, height } = e.target.getBoundingClientRect()
        const { width: boundingWidth, height: boundingHeight } = calcBounding(imageContainerRef, { width, height })

        setBounding({
            width: boundingWidth,
            height: boundingHeight
        })
    }

  return (
      <React.Fragment>
          <div className={styles["root"]}>
              <div className={styles["draggable-container"]}>
                <div className={styles["image-container"]} ref={imageContainerRef}>
                  <img draggable={false}
                       onLoad={(e) => handleImageLoad(e)}
                       onTouchStart={(e) => handleMouseDown(e)}
                       onMouseDown={(e) => handleMouseDown(e)}
                       src={src}
                       alt={src}
                       className={[styles["image"], styles["horizontal"]].join(" ")}
                  />
                </div>
              </div>
          </div>
          { JSON.stringify(bounding, null, 2)}
          { JSON.stringify(position, null, 2)}
      </React.Fragment>
  )
}
