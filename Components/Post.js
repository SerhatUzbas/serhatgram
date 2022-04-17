import React, { useState, useEffect } from 'react';
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import Moment from 'react-moment';
import { async } from '@firebase/util';

function Post(props) {
  const { data: session } = useSession();
  const [comment, setCommment] = useState('');
  const [comments, setCommments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'posts', props.id, 'comments'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => setCommments(snapshot.docs)
    );
  }, [db, props.id]);

  useEffect(() => {
    onSnapshot(query(collection(db, 'posts', props.id, 'likes')), (snapshot) =>
      setLikes(snapshot.docs)
    );
  }, [db, props.id]);

  const sentComment = async (e) => {
    e.preventDefault();
    const commentToSend = comment;
    setCommment('');

    await addDoc(collection(db, 'posts', props.id, 'comments'), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    []
  );

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', props.id, 'likes', session.user.uid), {
        username: session.user.username,
      });
      setHasLiked(false);
    } else {
      await setDoc(doc(db, 'posts', props.id, 'likes', session.user.uid), {
        username: session.user.username,
      });
      setHasLiked(true);
    }
  };

  return (
    <div className="my-5 rounded-sm border bg-white">
      {/* Header */}
      <div className="flex items-center p-5">
        <img
          src={props.userImg}
          className="mr-3 h-12 w-12 rounded-full border object-contain p-1"
          alt=""
        />
        <p className="flex-1 font-bold">{props.username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>
      {/* img */}
      <img className="w-full object-cover" alt="" src={props.img} />
      {/* Buttons */}
      {session && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="btn text-red-500"
              />
            ) : (
              <HeartIcon onClick={likePost} className="btn" />
            )}

            <ChatIcon className="btn" />
            <PaperAirplaneIcon className="btn" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}

      {/* caption */}
      <p className="truncate p-5">
        {likes.length > 0 && <p className="font-bold">{likes.length} likes</p>}
        <span className="mr-1 font-bold">{props.username}</span>
        {props.caption}
      </p>
      {/* comments */}

      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-black">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-3 flex items-center space-x-2 ">
              <img
                className="h-7 rounded-full"
                src={comment.data().userImage}
                alt=""
              />
              <p className="flex-1 text-sm">
                <span className="font-bold">{comment.data().username}</span>
                <span className="ml-1">{comment.data().comment}</span>
              </p>

              <Moment fromNow className="pr-5 text-xs">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* input box */}
      {session && (
        <form className="flex items-center p-4 ">
          <EmojiHappyIcon className="h-7" />
          <input
            type="text"
            value={comment}
            onChange={(e) => {
              return setCommment(e.target.value);
            }}
            placeholder="Add a comment"
            className="flex-1 border-none outline-none focus:ring-0"
          />
          <button
            onClick={sentComment}
            disabled={!comment.trim()}
            className="font-sm text-blue-400"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
