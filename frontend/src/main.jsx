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

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<GenerationNav/>}>
      <Route index element={ <Navigate to="/home" /> }></Route>
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
      <RouterProvider router={router} />
    </QueryClientProvider>
  //</React.StrictMode>
);