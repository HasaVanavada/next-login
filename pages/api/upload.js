import nextConnect from 'next-connect';
import multer from 'multer';
import Papa from 'papaparse';

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect()
  .use(upload.single('file'))
  .post((req, res) => {
    if (req.file) {
      Papa.parse(req.file.buffer.toString(), {
        complete: (result) => {
          res.status(200).json(result.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    } else {
      res.status(400).send('No file uploaded');
    }
  });

export default handler;