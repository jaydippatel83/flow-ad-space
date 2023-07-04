import React, { useContext, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Image from 'next/image';
import UserId from '../../components/userId';
import Head from 'next/head';
import Meta from '../../components/Meta';
import { Storage } from "@aws-amplify/storage"
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, db, doc, getDocs, query, storage, updateDoc, where } from '../../components/firebase';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthConext';



const Edit_user = () => {
	const authContex = useContext(AuthContext);
	const { user, update, setUpdate,userData } = authContex;
	const [preview, setPreview] = useState(userData !== undefined  ? userData?.Photo : '');
	const [coverPreview, setCoverPreview] = useState(userData !== undefined  ? userData?.Cover : '');
	const [username, setUserName] = useState(userData !== undefined  ? userData?.UserName : '')
	const [bio, setBio] = useState(userData !== undefined  ? userData?.Bio : '')
	const [email, setEmail] = useState(userData !== undefined ? userData?.Email : '')
	const [loading, setLoading] = useState(false);  
	
	async function onChangeAvatar(e) {
		setLoading(true);
		const file = e.target.files[0];
		const storageRef = ref(storage, `Photo/${file.name}`);
		uploadBytes(storageRef, file).then((snapshot) => {
			getDownloadURL(snapshot.ref).then((url) => {
				setPreview(url);
			});
		});
		setLoading(false);
	}


	const handleCoverPhoto = (e) => {
		const file = e.target.files[0];
		const storageRef = ref(storage, `Photos/${file.name}`);
		uploadBytes(storageRef, file).then((snapshot) => {
			getDownloadURL(snapshot.ref).then((url) => {
				setCoverPreview(url);
			});
		});
	};


	const handleUpdateProfile = async () => { 
		const data = {
			UserName: username,
			Bio: bio,
			Email: email,
			Photo: preview,
			Cover: coverPreview,
			Address: user && user?.addr,
			CreatedAt: new Date(),
		};
		const q = query(collection(db, "Users"), where("Address", "==", user?.addr));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			addDoc(collection(db, "Users"), data);
			setUpdate(!update);
			toast.success("Profile successfully Added!!");
		} else {
			querySnapshot.forEach((fire) => {
				const data = {
					UserName: username !== "" ? username : fire.data().UserName,
					Bio: bio !== "" ? bio : fire.data().Bio,
					Email: email,
					Photo: preview !== "" ? preview : fire.data().Photo,
					Cover: coverPreview !== "" ? coverPreview : fire.data().Cover,
					Address: user && user?.addr,
					UpdatedAt: new Date(),
				};
				const dataref = doc(db, "Users", fire.id);
				updateDoc(dataref, data);
				setUpdate(!update);
				toast.success("Profile successfully updated!!");
			});
		}
	};

	return (
		<div>
			<Meta title="Profile || NFT Marketplace Next.js Template" />
			<div className="pt-[5.5rem] lg:pt-24">
				{/* <!-- Banner --> */}
				<div className="relative">
					<img
						src={coverPreview ? coverPreview : (userData ? userData.Cover : '/images/user/banner.jpg')}
						alt="banner"
						className="h-[18.75rem] w-full object-cover"

					/>
					<div className="container relative -translate-y-4">
						<div className="font-display group hover:bg-accent absolute right-0 bottom-4 flex items-center rounded-lg bg-white py-2 px-4 text-sm">
							<input
								type="file"
								accept="image/*"
								className="absolute inset-0 cursor-pointer opacity-0"
								onChange={(e) => handleCoverPhoto(e)}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="24"
								height="24"
								className="fill-jacarta-400 mr-1 h-4 w-4 group-hover:fill-white"
							>
								<path fill="none" d="M0 0h24v24H0z"></path>
								<path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"></path>
							</svg>
							<span className="text-black mt-0.5 block group-hover:text-white">
								Edit cover photo
							</span>
						</div>
					</div>
				</div>
				{/* <!-- end banner --> */}
				{/* <!-- Edit Profile --> */}
				<section className="dark:bg-jacarta-800 relative py-16">
					<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
						<img src="/images/gradient_light.jpg" alt="gradient" className="h-full w-full" />
					</picture>
					<div className="container">
						<div className="mx-auto max-w-[48.125rem] md:flex">
							{/* <!-- Form --> */}
							<div className="mb-12 md:w-1/2 md:pr-8">
								<div className="mb-6">
									<label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
										Username<span className="text-red">*</span>
									</label>
									<input
										type="text"
										id="profile-username"
										className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
										placeholder="Enter username"
										required
										defaultValue={username ? username : (userData ? userData.UserName : "@username")}
										onChange={(e) => setUserName(e.target.value)}
									/>
								</div>
								<div className="mb-6">
									<label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
										Bio<span className="text-red">*</span>
									</label>
									<textarea
										id="profile-bio"
										className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
										required
										defaultValue={bio ? bio : (userData ? userData.Bio : "")}
										onChange={(e)=>setBio(e.target.value)}
										placeholder="Tell the world your story!"
									></textarea>
								</div>
								<div className="mb-6">
									<label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
										Email address<span className="text-red">*</span>
									</label>
									<input
										type="text"
										id="profile-email"
										className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
										placeholder="Enter email"
										required
										defaultValue={email ? email : (userData ? userData.Email : '')}
										onChange={(e)=>setEmail(e.target.value)}
									/>
								</div>
							 
								<div className="mb-6">
									<label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
										Wallet Address
									</label>

									<UserId
										classes="js-copy-clipboard dark:bg-jacarta-700 border-jacarta-100 hover:bg-jacarta-50 dark:border-jacarta-600 dark:text-jacarta-300 flex w-full select-none items-center rounded-lg border bg-white py-3 px-4"
										userId={user?.addr}
									/>
								</div>
								<button onClick={handleUpdateProfile} className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all">
									Update Profile
								</button>
							</div>
							{/* <!-- Avatar --> */}
							<div className="flex space-x-5 md:w-1/2 md:pl-8">
								<form className="shrink-0">
									<figure className="relative inline-block">
										<Image
											src={preview ? preview : ( userData ? userData.Photo : '/images/user/user_avatar.gif')}
											alt="collection avatar"
											className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
											height={140}
											width={140}
										/>
										<div className="group hover:bg-accent border-jacarta-100 absolute -right-3 -bottom-2 h-8 w-8 overflow-hidden rounded-full border bg-white text-center hover:border-transparent">
											<input
												type="file"
												accept="image/*"
												className="absolute top-0 left-0 w-full cursor-pointer opacity-0"
												onChange={(e) => onChangeAvatar(e)}
											/>
											<div className="flex h-full items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													className="fill-jacarta-400 h-4 w-4 group-hover:fill-white"
												>
													<path fill="none" d="M0 0h24v24H0z" />
													<path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" />
												</svg>
											</div>
										</div>
									</figure>
								</form>
								<div className="mt-4">
									<span className="font-display text-jacarta-700 mb-3 block text-sm dark:text-white">
										Profile Image
									</span>
									<p className="dark:text-jacarta-300 text-sm leading-normal">
										We recommend an image of at least 300x300. Gifs work too. Max 5mb.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* <!-- end edit profile --> */}
			</div>
		</div>
	);
};

export default Edit_user;
