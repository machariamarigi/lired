import Navbar from "../components/Navbar"
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from "../utils/createUrqlClient"
import { usePostsQuery } from "../generated/graphql"

const Index = () => {
    const [{ data }] = usePostsQuery()
    return (
        <div>
            <Navbar />
            <h1>Hello There</h1>
            <br />
            {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
        </div>
    )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
