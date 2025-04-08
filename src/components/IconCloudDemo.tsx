import { IconCloud } from "@/components/ui/interactive-icon-cloud";

const slugs = [
  "apple",
  "samsung",
  "lg",
  "sony",
  "panasonic",
  "philips",
  "toshiba",
  "huawei",
  "xiaomi",
  "dell",
  "hp",
  "lenovo",
  "asus",
  "acer",
  "nokia",
  "motorola",
  "sharp",
  "hitachi",
  "jbl",
  "bose",
  "sennheiser",
  "canon",
  "nikon",
  "fujifilm",
  "vizio",
  "tcl",
  "hisense",
  "oneplus",
  "oppo",
  "vivo",
  "boat",
];
const IconCloudDemo = () => {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden bg-background px-20 pb-20 pt-8 ">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
};

export default IconCloudDemo;
