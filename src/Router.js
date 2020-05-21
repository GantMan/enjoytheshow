import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import App from './App'
import Room from './Room'
import WatchRoom from './WatchRoom'
import CreateRoom from './CreateRoom'

export default function Router() {
  return (
    <BrowserRouter>
      <div className="site-container">
        <Header />
        <div>
          <Switch>
            <Route exact path="/">
              <App />
            </Route>
            <Route path="/room/:id">
              <Room />
            </Route>
            <Route path="/watch/:id">
              <WatchRoom />
            </Route>
            <Route path="/create">
              <CreateRoom />
            </Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
