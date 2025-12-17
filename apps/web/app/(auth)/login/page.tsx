export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      <form className="space-y-3">
        <input className="w-full border p-2" name="email" type="email" placeholder="Email" required />
        <input className="w-full border p-2" name="password" type="password" placeholder="Password" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
