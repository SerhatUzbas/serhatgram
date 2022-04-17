import { useRecoilState } from 'recoil';
import { modalState } from '../atom/modalAtom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { CameraIcon } from '@heroicons/react/outline';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore';
import { db, storage } from '../firebase';
import { useSession } from 'next-auth/react';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';

function Modal() {
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(false);
  const [loading, loadingSet] = useState(null);
  const { data: session } = useSession();
  const uploadPost = async () => {
    if (loading) return;

    loadingSet(true);
    // Creare a post and add to firestore posts,
    // get id for post
    // upload image to storage with id
    // get download url to add post
    const docRef = await addDoc(collection(db, 'posts'), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    await uploadString(imageRef, selectedFile, 'data_url').then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL,
        });
      }
    );
    setOpen(false);
    loadingSet(false);
    setSelectedFile(null);

    console.log('new doc', docRef.id);
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    console.log(reader);

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (re) => {
      setSelectedFile(re.target.result);
    };
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div
          className="flex min-h-[800px] items-end justify-center
                px-4 pt-4 pb-20 text-center sm:block
                sm:min-h-screen sm:p-0 "
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:scale-95"
          >
            <div
              className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4
                            text-left align-bottom shadow-xl  transition-all sm:my-8
                            sm:w-full sm:max-w-screen-sm sm:align-middle "
            >
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    className="w-full cursor-pointer object-contain"
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-100"
                  >
                    <CameraIcon className="h-6 w-6 text-red-600" />
                  </div>
                )}
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Upload a photo
                  </Dialog.Title>

                  <div>
                    <input
                      type="file"
                      hidden
                      ref={filePickerRef}
                      onChange={addImageToPost}
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      className="w-full border-none text-center focus:ring-0"
                      type="text"
                      ref={captionRef}
                      placeholder="Enter Caption"
                    />
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      disabled={!selectedFile}
                      onClick={uploadPost}
                      className="inline-flex w-full justify-center rounded-md 
  disabled:cursor-not-allowed"
                    >
                      {loading ? 'Uploading ...' : 'Upload '}
                    </button>
                  </div>
                </div>
              </div>
              <h1>Hello</h1>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;
