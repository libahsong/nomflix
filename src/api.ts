import React from "react";
const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  adult: boolean;
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name?: string;
  original_name?: string;
}

export interface IGetMovieResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGenres {
  id: number;
  name: string;
}

export interface IGetMovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: object;
  budget: number;
  genres: IGenres[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: object;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: object;
  production_countries: object;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: object;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGetTvDetails {
  adult: boolean;
  backdrop_path: string;
  created_by: object;
  episode_run_time: object;
  first_air_date: string;
  genres: IGenres[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: object;
  last_air_date: object;
  last_episode_to_air: object;
  name: string;
  next_episode_to_air: object;
  networks: object;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: object;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: object;
  production_countries: object;
  seasons: object;
  spoken_languages: object;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface ICast {
  name: string;
  known_for_department?: string;
}

export interface ICrew {
  department: string;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
}

export interface IGetMovieCredits {
  id: number;
  cast: ICast[];
  crew: ICrew[];
}

export interface IMovieCertification {
  id: number;
  results: IMCResults[];
}

export interface IMCResults {
  iso_3166_1: string;
  release_dates: [
    {
      certification: string;
      descriptors: [];
      iso_639_1: string;
      note: string;
      release_date: string;
      type: number;
    },
  ];
}

export interface ITvRating {
  results: ITRResults[];
  id: number;
}

export interface ITRResults {
  descriptors: [];
  iso_3166_1: string;
  rating: string;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&page=1`).then(
    (response) => response.json(),
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getUpcoming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getAiringTody() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getOnTheAir() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getPopularShows() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json(),
  );
}

export function getTopRatedShows() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?query=${keyword}&api_key=${API_KEY}`,
  ).then((response) => response.json());
}

export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?query=${keyword}&api_key=${API_KEY}`,
  ).then((response) => response.json());
}

export function getMovieGenres() {
  return fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
  ).then((response) => response.json());
}

export function getMovieDetails(id: number | null) {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
  ).then((response) => response.json());
}

export function getTvDetails(id: number | null) {
  return fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getMovieCredits(id: number | null) {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
  ).then((response) => response.json());
}

export function getTvCredits(id: number | null) {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`,
  ).then((response) => response.json());
}

export function getMovieCertification(id: number | null) {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${API_KEY}`,
  ).then((response) => response.json());
}

export function getTvRating(id: number | null) {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${API_KEY}`,
  ).then((response) => response.json());
}
