import Tesseract from "tesseract.js";

const OcrService = {
  tesseract: async (image) => {
    let res;
    await Tesseract.recognize(image, "vie").then(({ data: { text } }) => {
      res = text;
    });
    return res;
  },
};

export default OcrService;
