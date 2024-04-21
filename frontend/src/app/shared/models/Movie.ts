export class Movie{
    id!: string;
    title!: string;
    year!: number;
    genre!: string;
    director?: string;
    plot!: string;
    rating?: number;
    imageUrl!: string;
    trailerUrl!: string;
}