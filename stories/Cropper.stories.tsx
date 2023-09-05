import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Cropper, CropperProps } from '../src';

const meta: Meta = {
  title: 'Cropper',
  component: Cropper,
  argTypes: {
    src: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<CropperProps> = (args) => <Cropper {...args} />;

export const Default = Template.bind({});

Default.args = {
  src: "",
  position: {
    top: 0,
    left: 0,
  },
  onChangeEnd: (position) => console.log(position)
};
