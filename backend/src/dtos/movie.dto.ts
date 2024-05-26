export interface GenreDTO {
  id: number;
  name: string;
}

export interface VideoDTO {
  id: string;
  name: string;
  key: string;
  site: string;
  type: string;
}

export interface ImageDTO {
  file_path: string;
  width: number;
  height: number;
}

export interface MovieDetailDTO {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: {
    results: {
      id: string;
      name: string;
      key: string;
      site: string;
      type: string;
    }[];
  };
  images: {
    backdrops: {
      aspect_ratio: number;
      height: number;
      iso_639_1: string | null;
      file_path: string;
      vote_average: number;
      vote_count: number;
      width: number;
    }[];
    logos: {
      aspect_ratio: number;
      height: number;
      iso_639_1: string | null;
      file_path: string;
      vote_average: number;
      vote_count: number;
      width: number;
    }[];
    posters: {
      aspect_ratio: number;
      height: number;
      iso_639_1: string | null;
      file_path: string;
      vote_average: number;
      vote_count: number;
      width: number;
    }[];
  };
}
