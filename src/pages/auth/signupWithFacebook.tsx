import "firebase/auth";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const SignupWithFacebook = () => {
	const auth = getAuth();

	const handleFacebookSignup = async () => {
		try {
			const provider = new FacebookAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			console.log(
				"🚀 ~ file: signupWithFacebook.tsx:12 ~ handleFacebookSignup ~ user:",
				user
			);
			// You can now use the user object to save user data to your database or display the user's profile information
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<button onClick={handleFacebookSignup}>Signup with Facebook</button>
		</div>
	);
};
export default SignupWithFacebook;
