import {Movie} from "../interfaces/movie.interface";

export const MOVIES_MOCK: Movie[] = [{
  id: 1,
  title: 'Life of Brian',
  trailer: 'https://youtu.be/GeKzBQnAq5I?feature=shared',
  watched: false,
  saved: false,
}, {
  id: 2,
  title: 'Machete Kills!',
  trailer: 'https://youtu.be/DwbG64YC-vQ?feature=shared',
  watched: false,
  saved: false,
}, {
  id: 3,
  title: 'Gasthaus Paradiso',
  trailer: 'https://youtu.be/Vl1q_uY9HXI?feature=shared',
  watched: true,
  saved: false,
}];
