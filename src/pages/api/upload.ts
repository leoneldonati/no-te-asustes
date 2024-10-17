import type { APIRoute } from "astro";
import { res } from "../../scripts/response";
import { uploadStream } from "../../services/cloudinary";

export const POST: APIRoute = async ({ request }) => {
  try {
    const arrayBuffer = await (await request.blob()).arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const { ok, result } = await uploadStream(buffer);

    if (!ok) return res({ message: "Error al subir archivo" }, { status: 400 });

    const { public_id, width, height } = result;

    return res({ publicId: public_id, width, height });
  } catch (error) {
    console.log(error);
    return res({ message: "Error en la carga de archivos" }, { status: 500 });
  }
};
