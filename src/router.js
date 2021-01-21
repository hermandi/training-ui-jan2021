import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [
  // Dashboards
  {
    path: '/dashboard',
    Component: lazy(() => import('pages/dashboard/alpha')),
    exact: true,
  },

  // Produk Reya
  {
    path: '/reya/inputProduk',
    Component: lazy(() => import('pages/reya/input-produk')),
    exact: true,
  },

  {
    path: '/reya/reportingProduk',
    Component: lazy(() => import('pages/reya/reporting-produk')),
    exact: true,
  },

  // Home
  {
    path: '/home-faza',
    Component: lazy(() => import('pages/fazalika/home-product')),
    exact: true,
  },

  // Input Product
  {
    path: '/product/new',
    Component: lazy(() => import('pages/fazalika/input-product')),
    exact: true,
  },

  // Edit Product
  {
    path: '/product/edit/',
    Component: lazy(() => import('pages/fazalika/edit-product')),
    exact: false,
  },

  // Reporting Product
  {
    path: '/reporting-product-faza',
    Component: lazy(() => import('pages/fazalika/reporting-product')),
    exact: true,
  },

  // Gadai
  {
    path: '/gadai/data',
    Component: lazy(() => import('pages/gadai/new-gadai')),
    exact: true,
  },
  // Report
  {
    path: '/report/user',
    Component: lazy(() => import('pages/report/report-user')),
    exact: true,
  },
  {
    path: '/report/gadai',
    Component: lazy(() => import('pages/report/report-gadai')),
    exact: true,
  },
  // Adit
  {
    path: '/adit/data-produk',
    Component: lazy(() => import('pages/adit/data-produk')),
    exact: true,
  },
  {
    path: '/adit/reporting-produk',
    Component: lazy(() => import('pages/adit/reporting-produk')),
    exact: true,
  },

  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={state => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
