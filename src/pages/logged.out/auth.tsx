import { ok } from 'assert'
import gql from 'graphql-tag'
import React from 'react'


const MUTATION_CREATE_ACCOUNT = gql`    
    mutation CreateAccount(
        $username: String!,
        $email: String!,
        $name: String,
        $password: String!,
        $location: String,
        $githubUsername: String,        
    ) {
        createAccount(
            username: $username,
            email: $email,
            name: $name,
            password: $password,
            location: $location,
            githubUsername: $githubUsername
        ) {
            ok
        error
        }
        
    }
`

const MUTATION_LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            ok
            error
            token
        }
    }
`;

type AuthPageProps = {
    isCreating: boolean;
}

export const AuthPage:React.FC<AuthPageProps> = () => {
    return <div><p>횐님, 횐 가입하셨음까?</p></div>
}
