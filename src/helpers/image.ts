const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.NEXT_PUBLIC_DOMAIN;

export const extractSubImage = async (
  originalImagePath: string,
  rect: MintRect,
  size: Size,
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not create canvas context."));
        return;
      }

      ctx.drawImage(
        img,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        size.width,
        size.height,
      );
      const dataUrl = canvas.toDataURL(); // Get the data URL of the subimage

      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error("Failed to load the original image."));
    };

    img.src = originalImagePath;
  });
};

export const dynamicBlurDataUrl = async (url: string) => {
  const base64str = await fetch(
    `${baseUrl}/_next/image?url=${url}&w=16&q=75`,
  ).then(async (res) =>
    Buffer.from(await res.arrayBuffer()).toString("base64"),
  );

  const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
      <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='1' />
      </filter>

      <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' 
      href='data:image/avif;base64,${base64str}' />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
};

export const imageToDataUri = (file: File) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result);
    };
    reader.readAsDataURL(file);
  });
