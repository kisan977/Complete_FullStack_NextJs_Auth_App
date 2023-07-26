export default function UserProfile({ params }: any) {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-indigo-600">
      <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
        welcome to user Profile :{params.id}
      </h2>
    </div>
  );
}
