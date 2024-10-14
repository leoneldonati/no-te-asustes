import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.PUBLIC_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export async function uploadStream(buffer: Buffer) {
  const promise = new Promise<{ ok: boolean; err?: any; result?: any }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "hackaton-images",
          },
          (err, result) => {
            if (err) {
              return reject({ ok: false, err });
            }

            return resolve({ ok: true, result });
          }
        )
        .end(buffer);
    }
  );

  try {
    const resolved = await promise;

    if (!resolved.ok)
      return {
        ok: false,
        error: resolved.err,
      };

    return {
      ok: true,
      result: resolved.result,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}
