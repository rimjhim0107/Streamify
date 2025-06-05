import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon } from 'lucide-react'; // Added CameraIcon here
import { LANGUAGES } from '../constants';

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [ formState, setFormState ] = useState({
     fullName: authUser?.fullName || "",
     bio: authUser?.bio || "",
     nativeLanguage: authUser?.nativeLanguage || "",
     learningLanguage: authUser?.learningLanguage || "",
     location: authUser?.location || "",
     profilePic: authUser?.profilePic || "", // Added optional chaining here
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
     mutationFn: completeOnboarding,
     onSuccess: () => {
        toast.success("Profile Onboarded Successfully");
        queryClient.invalidateQueries({ queryKey : ["authUser"]});
     },
     onError: (error) => {
        toast.error(error.response?.data?.message || 'An error occurred');
     }
  })

  const handleSubmit = (e) => {
     e.preventDefault();
     onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
      const idx = Math.floor(Math.random()*100) + 1;
      const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
      setFormState({ ...formState, profilePic: randomAvatar});
      toast.success("Random profile picture generated!");
  }

  return (
     <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
           <div className='card-body p-6 sm:p-8'>
              <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>
              <form onSubmit={handleSubmit} className='space-y-6 '>
                 {/* PROFILE PIC CONTAINER */}
                 <div className='flex flex-col items-center justify-center space-y-4'>
                    {/* IMAGE PREVIEW */}
                    <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                       {formState.profilePic ? (
                          <img 
                            src={formState.profilePic}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                       ) : (
                        <div className='flex items-center justify-center h-full'>
                           <CameraIcon className="size-12 text-base-content opacity-40"/>
                        </div>
                       )}
                    </div>
                    {/* GENERATE RANDOM AVATAR */}
                    <div className='flex items-center gap-2'>
                        <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                           <ShuffleIcon className='size-4 mr-2'/>
                           Generate Random Avatar
                        </button>
                    </div>
                 </div>
                 {/* FULL NAME */}
                 <div className='form-control'>
                    <label className='label'>
                       <span className='label-text'>Full Name</span>
                    </label>
                    <input
                       type='text'
                       name='fullName'
                       value={formState.fullName}
                       onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                       className='input input-bordered w-full'
                       placeholder='Your full name'
                    />
                 </div>

                 {/* BIO */}
                 <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Bio</span>
                    </label>
                    <textarea
                      name='bio'
                      value={formState.bio}
                      onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                      className='textarea textarea-bordered h-24'
                      placeholder='Tell others about yourself and your language learning goals'
                    />
                 </div>

                 {/* LANGUAGES */}
                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* NATIVE LANGUAGE */}
                    <div className='form-control'>
                       <label className='label'>
                          <span className='label-text'>Native Language</span>
                       </label>
                       <select
                         name='nativeLanguage'
                         value={formState.nativeLanguage}
                         onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                         className='select select-bordered w-full'
                       >
                         <option value="">Select your native language</option>
                         {LANGUAGES.map((lang) => (
                            <option key={`native-${lang}`} value={lang.toLowerCase()}>
                              {lang}
                            </option>
                         ))}
                       </select>
                    </div>
                    {/* LEARNING LANGUAGE */}
                    <div className='form-control'>
                       <label className='label'>
                          <span className='label-text'>Learning Language</span>
                       </label>
                       <select
                         name='learningLanguage'
                         value={formState.learningLanguage}
                         onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                         className='select select-bordered w-full'
                       >
                         <option value="">Select the language you're learning</option>
                         {LANGUAGES.map((lang) => (
                            <option key={`learn-${lang}`} value={lang.toLowerCase()}>
                              {lang}
                            </option>
                         ))}
                       </select>
                    </div>
                 </div>

                 {/* LOCATION */}
                 <div className='form-control'>
                    <label className='label'>
                       <span className='label-text'>Location</span>
                    </label>
                    <div className='relative'>
                       <MapPinIcon
                          className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'
                       />
                       <input
                          type="text"
                          name="location"
                          value={formState.location}
                          onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                          className='input input-bordered w-full pl-10'
                          placeholder="City, Country"
                       />
                    </div>
                 </div>

                 {/* SUBMIT BUTTON */}
                 <button className='btn btn-primary w-full' disabled={isPending} type="submit">
                    {!isPending ? (
                     <>
                       <ShipWheelIcon className='size-5 mr-2'/>
                       Complete Onboarding
                     </>
                    ) : (
                     <>
                       <LoaderIcon className='animate-spin size-5 mr-2'/>
                        Onboarding...
                     </>
                    )}
                 </button>
              </form>              
           </div>
        </div>
     </div>
  )
}

export default OnboardingPage













// import React from 'react';
// import useAuthUser from '../hooks/useAuthUser';
// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { completeOnboarding } from '../lib/api';
// import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon } from 'lucide-react';
// import { LANGUAGES } from '../constants';

// const OnboardingPage = () => {
//   const { authUser } = useAuthUser();
//   const queryClient = useQueryClient();

//   const [formState, setFormState] = useState({
//     fullName: authUser?.fullName || '',
//     bio: authUser?.bio || '',
//     nativeLanguage: authUser?.nativeLanguage || '',
//     learningLanguage: authUser?.learningLanguage || '',
//     location: authUser?.location || '',
//     profilePic: authUser?.profilePic || '',
//   });

//   const { mutate: onboardingMutation, isPending } = useMutation({
//     mutationFn: completeOnboarding,
//     onSuccess: () => {
//       toast.success('Profile Onboarded Successfully');
//       queryClient.invalidateQueries({ queryKey: ['authUser'] });
//     },
//     onError: (error) => {
//       toast.error(error.response.data.message);
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onboardingMutation(formState);
//   };

//   const handleRandomAvatar = () => {
//     const idx = Math.floor(Math.random() * 100) + 1;
//     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
//     setFormState({ ...formState, profilePic: randomAvatar });
//     toast.success('Random profile picture generated!');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-100 px-2">
//       <div className="card w-full max-w-lg bg-base-200 shadow-md">
//         <div className="card-body p-3 sm:p-4">
//           <h1 className="text-lg sm:text-xl font-semibold text-center mb-3">Complete Your Profile</h1>

//           <form onSubmit={handleSubmit} className="space-y-3">
//             {/* Profile Picture */}
//             <div className="flex flex-col items-center">
//               <div className="w-20 h-20 rounded-full bg-base-300 overflow-hidden">
//                 {formState.profilePic ? (
//                   <img src={formState.profilePic} alt="Profile" className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <CameraIcon className="size-6 text-base-content opacity-40" />
//                   </div>
//                 )}
//               </div>
//               <button
//                 type="button"
//                 onClick={handleRandomAvatar}
//                 className="btn btn-accent btn-xs mt-2"
//               >
//                 <ShuffleIcon className="size-3 mr-1" />
//                 Random Avatar
//               </button>
//             </div>

//             {/* Full Name */}
//             <div className="form-control">
//               <label className="label label-text text-sm">Full Name</label>
//               <input
//                 type="text"
//                 value={formState.fullName}
//                 onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
//                 className="input input-xs input-bordered"
//                 placeholder="Your name"
//               />
//             </div>

//             {/* Bio */}
//             <div className="form-control">
//               <label className="label label-text text-sm">Bio</label>
//               <textarea
//                 value={formState.bio}
//                 onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
//                 className="textarea textarea-bordered textarea-xs resize-none"
//                 placeholder="Tell us about you"
//                 rows={2}
//               />
//             </div>

//             {/* Languages */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
//               <div className="form-control">
//                 <label className="label label-text text-sm">Native Language</label>
//                 <select
//                   value={formState.nativeLanguage}
//                   onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
//                   className="select select-xs select-bordered"
//                 >
//                   <option value="">Select</option>
//                   {LANGUAGES.map((lang) => (
//                     <option key={`native-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="form-control">
//                 <label className="label label-text text-sm">Learning Language</label>
//                 <select
//                   value={formState.learningLanguage}
//                   onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
//                   className="select select-xs select-bordered"
//                 >
//                   <option value="">Select</option>
//                   {LANGUAGES.map((lang) => (
//                     <option key={`learn-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Location */}
//             <div className="form-control">
//               <label className="label label-text text-sm">Location</label>
//               <div className="relative">
//                 <MapPinIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-base-content opacity-70" />
//                 <input
//                   type="text"
//                   value={formState.location}
//                   onChange={(e) => setFormState({ ...formState, location: e.target.value })}
//                   className="input input-xs input-bordered pl-7"
//                   placeholder="City, Country"
//                 />
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isPending}
//               className="btn btn-primary btn-xs w-full mt-1"
//             >
//               {!isPending ? (
//                 <>
//                   <ShipWheelIcon className="size-3 mr-1" />
//                   Complete
//                 </>
//               ) : (
//                 <>
//                   <LoaderIcon className="animate-spin size-3 mr-1" />
//                   Onboarding...
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnboardingPage;
