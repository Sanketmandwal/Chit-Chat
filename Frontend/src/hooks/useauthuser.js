import { useQuery } from "@tanstack/react-query"
import { getauthuser } from "../lib/api"

const useAuthUser = () => {
    const authuser = useQuery({
        queryKey: ["authuser"],
        queryFn: getauthuser,
        retry: false
    })

    return { isLoading: authuser.isLoading, authuser: authuser.data?.user }
}

export default useAuthUser
