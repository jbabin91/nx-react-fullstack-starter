import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AboutImport } from './routes/about'
import { Route as AuthImport } from './routes/_auth'
import { Route as IndexImport } from './routes/index'
import { Route as PostsIndexImport } from './routes/posts/index'
import { Route as AuthProfileImport } from './routes/_auth.profile'

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PostsIndexRoute = PostsIndexImport.update({
  path: '/posts/',
  getParentRoute: () => rootRoute,
} as any)

const AuthProfileRoute = AuthProfileImport.update({
  path: '/profile',
  getParentRoute: () => AuthRoute,
} as any)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/profile': {
      preLoaderRoute: typeof AuthProfileImport
      parentRoute: typeof AuthImport
    }
    '/posts/': {
      preLoaderRoute: typeof PostsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AuthRoute.addChildren([AuthProfileRoute]),
  AboutRoute,
  LoginRoute,
  PostsIndexRoute,
])
