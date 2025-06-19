import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  getUserFriends,
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from '../lib/api';
import { CheckCircleIcon, UserPlusIcon } from 'lucide-react';
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import { getLanguageFlag } from '../components/FriendCard';
import { capitialize } from '../lib/utils';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function FriendsPage() {
  const queryClient = useQueryClient();
  const [outReqs, setOutReqs] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  const { data: recUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoing = [] } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendReq, isLoading: sending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] }),
  });

  useEffect(() => {
    const s = new Set();
    outgoing.forEach(r => r.recipient?._id && s.add(r.recipient._id));
    setOutReqs(s);
  }, [outgoing]);

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-10">
          {/* Your Friends Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Friends</h2>
            </div>

            {loadingFriends ? (
              <div className="py-10 text-center">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : friends.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map(f => (
                  <FriendCard key={f._id} friend={f} />
                ))}
              </div>
            )}
          </section>

          {/* Discover Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Discover New People</h2>
              <p className="text-gray-500">Find learners who match your interests</p>
            </div>

            {loadingUsers ? (
              <div className="py-10 text-center">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : recUsers.length === 0 ? (
              <div className="p-6 text-center bg-base-200 rounded-lg">
                <h3 className="font-semibold text-lg">No Recommendations Yet</h3>
                <p className="opacity-70">Check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recUsers.map(u => {
                  const sent = outReqs.has(u._id);
                  return (
                    <div key={u._id} className="card bg-base-200 hover:shadow-lg transition">
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="avatar size-16 rounded-full overflow-hidden">
                            <img
                              src={u.profilePic}
                              alt={u.fullName}
                              onError={e => (e.currentTarget.src = '/default-avatar.png')}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{u.fullName}</h3>
                            {u.location && (
                              <p className="text-xs text-gray-500 mt-1">{u.location}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-secondary">
                            {getLanguageFlag(u.nativeLanguage)}
                            Native: {capitialize(u.nativeLanguage)}
                          </span>
                          <span className="badge badge-outline">
                            {getLanguageFlag(u.learningLanguage)}
                            Learning: {capitialize(u.learningLanguage)}
                          </span>
                        </div>

                        {u.bio && <p className="text-sm opacity-70">{u.bio}</p>}

                        <button
                          className={`btn w-full mt-2 ${sent ? 'btn-disabled' : 'btn-primary'}`}
                          onClick={() => sendReq(u._id)}
                          disabled={sent || sending}
                        >
                          {sent ? (
                            <>
                              <CheckCircleIcon className="mr-2 h-4 w-4" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="mr-2 h-4 w-4" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
