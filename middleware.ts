import { NextResponse } from 'next/server';
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';

export function middleware(request: any) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('auth_token');
  const userRole = request.cookies.get('user_role');
  const isAuth = useSelector((state: RootState) => state.auth.value.isAuth);
  const role = useSelector((state: RootState) => state.auth.value.role);

  // Suppose que le rôle est stocké dans un cookie

  // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
  if (!isAuth) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur n'a pas le rôle d'ADMIN ou GERANT, redirige vers une page d'erreur
  if (role !== 'ADMIN' && role !== 'GERANT') {
    url.pathname = '/unauthorized'; // Crée cette page pour gérer les accès non autorisés
    return NextResponse.redirect(url);
  }

  // Si toutes les conditions sont remplies, l'utilisateur peut accéder à la page
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Applique le middleware à toutes les routes /admin et /admin/*
};
