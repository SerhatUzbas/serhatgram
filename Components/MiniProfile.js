import { useSession } from 'next-auth/react';
import React from 'react';

function MiniProfile() {
  const { data: session } = useSession();
  return (
    <div className="mt-14 ml-10 flex items-center justify-between">
      <img
        src={session?.user?.image}
        alt=""
        className=" h-16 w-16 rounded-full border "
      />
      <div className="mx-4 flex-1 ">
        <h2 className="font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400 ">Welcome Instagram</h3>
      </div>
      <button className="text-sm font-semibold text-blue-400">Sign out</button>
    </div>
  );
}

export default MiniProfile;
