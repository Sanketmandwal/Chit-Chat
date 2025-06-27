import {LoaderIcon} from 'lucide-react'

const Pageloader = () =>{
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoaderIcon className='animate-spin size-10 text-primary' />
        </div>
    )
}
export default Pageloader