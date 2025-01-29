import z from 'zod'

export const createOrUpdateProductSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	price: z.string().min(1, { message: 'Price is required' }),
	maxQuantity: z.string().min(1, { message: 'Max quantity is required' }),
	category: z.string().min(1, { message: 'Category is required' }),
	heroImage: z
		.any()
		.refine((file) => file.length === 1, 'Hero Image is required'),
	images: z
		.any()
		.refine(
			(files: FileList | null) =>
				files instanceof FileList && files.length > 0,
			{ message: 'Images are required' }
		),
	intent: z
		.enum(['create', 'update'], { message: 'Invalid intent' })
		.optional(),
	slug: z.string().optional(),
})

export type CreateOrUpdateProductSchema = z.infer<
	typeof createOrUpdateProductSchema
>

export const createProductSchemaServer = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	price: z.number().positive({ message: 'Price is required' }),
	maxQuantity: z.number().positive({ message: 'Max quantity is required' }),
	category: z.number().positive({ message: 'Category is required' }),
	heroImage: z.string().url({ message: 'Hero Image is required' }),
	images: z.array(z.string().url({ message: 'Images are required' })),
})

export type CreateProductSchemaServer = z.infer<
	typeof createProductSchemaServer
>
