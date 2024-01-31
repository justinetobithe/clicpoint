import React, { useContext } from 'react'
import { Route } from 'react-router-dom'
import { AppContext } from '../store'

export default function GuestRoute({ component: Component, ...rest }) {
    const { state } = useContext(AppContext)

    return (
        <Route
            {...rest}
            render={(props) =>
                !isset(state.user.id) ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: props.location }
                        }}
                    />
                )}
        />
    )
}
