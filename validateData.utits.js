import z from "zod";

export function validateSchoolData(data) {
  const schooldataScheme = z.object({
    name: z.string().min(1, { message: "Enter a valid school name" }),
    address: z.string().min(1, { message: "Enter a valid school address" }),
    latitude: z
      .number()
      .refine((val) => !isNaN(val), { message: "Enter a valid latitude" })
      .refine((val) => val >= -90 && val <= 90, {
        message: "Latitude must be between -90 and 90",
      }),
    longitude: z
      .number()
      .refine((val) => !isNaN(val), { message: "Enter a valid longitude" })
      .refine((val) => val >= -180 && val <= 180, {
        message: "Longitude must be between -180 and 180",
      }),
  });
  return schooldataScheme.safeParse(data);
}

export function validateQueryParam(data) {
  const queryParamSchema = z.object({
    latitude: z
      .number()
      .refine((val) => !isNaN(val), { message: "Enter a valid latitude" })
      .refine((val) => val >= -90 && val <= 90, {
        message: "Latitude must be between -90 and 90",
      }),
    longitude: z
      .number()
      .refine((val) => !isNaN(val), { message: "Enter a valid longitude" })
      .refine((val) => val >= -180 && val <= 180, {
        message: "Longitude must be between -180 and 180",
      }),
  });
  const convertedData = {
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
  };

  return queryParamSchema.safeParse(convertedData);
}
