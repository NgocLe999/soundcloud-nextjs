import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: '/auth/signin',
  }
})

export const config = { matcher: ["/playlists","/track/upload"] }


// Bắt buộc đăng nhập mới có thể redirect tới các trang đó.