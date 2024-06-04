import { environment } from '../../../environments/environment';

const BASE_URL = environment.production ? '' : 'http://localhost:4201';

export const MOVIES_BY_SEARCH_URL =
  BASE_URL + '/api/movies/search?query=:query&page=:page';
export const MOVIES_NEXT_POPULAR = BASE_URL + '/api/movies/popularMovies/next';
export const MOVIES_BY_IDS = BASE_URL + '/api/movies?ids=:ids';

export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';

export const MOVIES_GET_WATCHED = BASE_URL + 'api/movies/getWatchedMovies';
export const MOVIES_ADD_WATCHED = BASE_URL + 'api/users/watched';
export const MOVIES_DELETE_WATCHED = BASE_URL + 'api/users/watched/:movieId';
export const MOVIES_RATE_WATCHED = BASE_URL + 'api/users/watched/rating';

export const MOVIES_GET_WATCH_LATER =
  BASE_URL + 'api/movies/getWatchLaterMovies';
export const MOVIES_ADD_WATCH_LATER = BASE_URL + 'api/users/watchLater';
export const MOVIES_DELETE_WATCH_LATER =
  BASE_URL + 'api/users/watchLater/:movieId';
