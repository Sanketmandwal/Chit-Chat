import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { completeonboarding } from '../lib/api'
import { Camera, Shuffle, User, Phone, Calendar, MapPin, Info } from 'lucide-react'
import useAuthUser from '../hooks/useauthuser'

export const Onboarding = () => {
  const { authuser } = useAuthUser()
  const queryClient = useQueryClient()

  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';
    return d.toISOString().slice(0, 10);
  }

  const [formState, setFormState] = useState({
    name: authuser?.name || '',
    bio: authuser?.bio || '',
    gender: '',
    dob: formatDate(authuser?.dob),
    phone: authuser?.phone || '',
    image: authuser?.image || '',
    address: {
      line1: authuser?.address?.line1 || '',
      line2: authuser?.address?.line2 || ''
    }
  })

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1
    setFormState(prev => ({ ...prev, image: `https://avatar.iran.liara.run/public/${idx}.png` }))
  }

  const { mutate: onboardingmutation, isPending } = useMutation({
    mutationFn: completeonboarding,
    onSuccess: () => {
      toast.success('Profile onboarded successfully')
      queryClient.invalidateQueries({ queryKey: ['authuser'] })
    },
    onError : (error) =>{
      toast.error(error.response.data.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formState)
    onboardingmutation(formState)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-0">
      <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Avatar */}
          <div className="col-span-1 flex flex-col items-center">
            <div className="relative">
              {formState.image ? (
                <img
                  src={formState.image}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white/20 border-4 border-white">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="absolute bottom-0 right-0 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 shadow-lg"
                title="Random Avatar"
              >
                <Shuffle className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-white/80">Shuffle for a random avatar</p>
          </div>

          {/* Fields Column 1 */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-semibold text-white flex items-center gap-1">
                <User className="w-5 h-5" /> Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formState.name}
                onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                className="border border-white/50 rounded-lg px-4 py-2 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/80"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="gender" className="mb-1 font-semibold text-white flex items-center gap-1">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="currentColor"/></svg>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formState.gender}
                onChange={e => setFormState(prev => ({ ...prev, gender: e.target.value }))}
                className="border border-white/50 rounded-lg px-4 py-2 bg-white/20  focus:outline-none focus:ring-2 focus:ring-white/80"
                required
              >
                <option value="" disabled className="bg-white/20 ">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="dob" className="mb-1 font-semibold text-white flex items-center gap-1">
                <Calendar className="w-5 h-5" /> Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                value={formState.dob}
                onChange={e => setFormState(prev => ({ ...prev, dob: e.target.value }))}
                className="border border-white/50 rounded-lg px-4 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/80"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1 font-semibold text-white flex items-center gap-1">
                <Phone className="w-5 h-5" /> Phone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formState.phone}
                onChange={e => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                className="border border-white/50 rounded-lg px-4 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/80"
              />
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label htmlFor="bio" className="mb-1 font-semibold text-white flex items-center gap-1">
                <Info className="w-5 h-5" /> Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={2}
                value={formState.bio}
                onChange={e => setFormState(prev => ({ ...prev, bio: e.target.value }))}
                className="border border-white/50 rounded-lg px-4 py-2 bg-white/20 text-white placeholder-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-white/80"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="address.line1" className="mb-1 font-semibold text-white flex items-center gap-1">
                <MapPin className="w-5 h-5" /> Address 1
              </label>
              <input
                id="address.line1"
                type="text"
                name="address.line1"
                value={formState.address.line1}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))
                }
                className="border border-white/50 rounded-lg px-4 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/80"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="address.line2" className="mb-1 font-semibold text-white flex items-center gap-1">
                <MapPin className="w-5 h-5" /> Address 2
              </label>
              <input
                id="address.line2"
                type="text"
                name="address.line2"
                value={formState.address.line2}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))
                }
                className="border border-white/50 rounded-lg px-4 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/80"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="col-span-3 mt-4 w-full py-3 font-semibold rounded-lg bg-white text-purple-700 hover:bg-white/90 transition disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Complete Onboarding'}
          </button>
        </form>
      </div>
    </div>
  )
}
