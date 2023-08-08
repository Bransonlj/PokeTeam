import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import VersionNav from './views/layout/VersionNav';
import GenerationNav from './views/layout/GenerationNav';
import MainContainer from './views/MainContainer';
import HomePage from './views/HomePage/HomePage';
import { useBaseURL } from './utils/urls';
import { TeamContextProvider } from './context/TeamContext';

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    // Base URL
    <Route path={"PokeTeam"} element={<GenerationNav/>}>
      <Route index element={ <Navigate to={useBaseURL("/home")} /> }></Route>
      <Route path="home" element={ <HomePage /> }></Route>
      <Route path="generation/:gen" element={<VersionNav />}>
        <Route path=":version" element={<MainContainer />}></Route>
      </Route>

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TeamContextProvider>
        <RouterProvider router={router} />
      </TeamContextProvider>
    </QueryClientProvider>
  //</React.StrictMode>
);