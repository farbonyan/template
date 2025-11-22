import * as React from "react";
import {
  getAbsoluteZoom,
  getZoomFactor,
} from "advanced-cropper/extensions/absolute-zoom";
import * as CropperPrimitive from "react-advanced-cropper";

import "react-advanced-cropper/dist/style.css";

import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Slider } from "./slider";

type NavigationProps = {
  zoom: number;
  onZoom: (value: number, transitions?: boolean) => void;
  className?: string;
  disabled?: unknown;
};

const Navigation = ({ className, onZoom, zoom }: NavigationProps) => {
  const onZoomIn = React.useCallback(() => {
    onZoom(Math.min(1, zoom + 0.25), true);
  }, [onZoom, zoom]);

  const onZoomOut = React.useCallback(() => {
    onZoom(Math.max(0, zoom - 0.25), true);
  }, [onZoom, zoom]);

  return (
    <div
      className={cn(
        "absolute inset-x-4 bottom-4 flex items-center gap-1",
        className,
      )}
    >
      <ZoomInIcon className="size-4" onClick={onZoomIn} />
      <Slider
        value={[zoom * 100]}
        onValueChange={(value) => value[0] && onZoom(value[0] / 100)}
        min={0}
        max={100}
        step={1}
      />
      <ZoomOutIcon className="size-4" onClick={onZoomOut} />
    </div>
  );
};

type FixedCropperWrapperProps = React.PropsWithChildren<{
  cropper: CropperPrimitive.CropperRef;
  className?: string;
  style?: React.CSSProperties;
}>;

const FixedCropperWrapper = ({
  cropper,
  children,
  className,
}: FixedCropperWrapperProps) => {
  const state = cropper.getState();
  const settings = cropper.getSettings();
  const absoluteZoom = getAbsoluteZoom(state, settings);

  const onZoom = React.useCallback(
    (value: number, transitions?: boolean) => {
      cropper.zoomImage(getZoomFactor(state, settings, value), {
        transitions: !!transitions,
      });
    },
    [cropper, settings, state],
  );

  return (
    <CropperPrimitive.CropperFade className={className} visible={state}>
      {children}
      <Navigation zoom={absoluteZoom} onZoom={onZoom} />
    </CropperPrimitive.CropperFade>
  );
};

type FixedCropperRef = CropperPrimitive.FixedCropperRef;

type FixedCropperProps = CropperPrimitive.FixedCropperProps & {
  circle?: boolean;
};

const FixedCropper = React.forwardRef<FixedCropperRef, FixedCropperProps>(
  ({ circle, stencilProps, ...props }, ref) => {
    return (
      <CropperPrimitive.FixedCropper
        ref={ref}
        stencilProps={{
          handlers: false,
          lines: false,
          movable: false,
          resizable: false,
          ...stencilProps,
        }}
        stencilComponent={
          circle
            ? CropperPrimitive.CircleStencil
            : CropperPrimitive.RectangleStencil
        }
        imageRestriction={CropperPrimitive.ImageRestriction.stencil}
        wrapperComponent={FixedCropperWrapper}
        {...props}
      />
    );
  },
);
FixedCropper.displayName = "FixedCropper";

const Cropper = CropperPrimitive.Cropper;

type CropperRef = CropperPrimitive.CropperRef;

const ImageRestriction = CropperPrimitive.ImageRestriction;

export {
  Cropper,
  FixedCropper,
  ImageRestriction,
  type CropperRef,
  type FixedCropperRef,
};
