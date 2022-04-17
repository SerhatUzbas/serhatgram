import React from 'react'

function Story({ img, username }) {
  return (
    <div>
      <img
        src={img}
        alt={username}
        className="h-14 w-14 cursor-pointer rounded-full border-2 border-red-500 object-contain p-[1.5px] transition-all duration-150 ease-out hover:scale-110"
      />
      <p className="w-14 truncate text-xs">{username}</p>
    </div>
  )
}

export default Story
