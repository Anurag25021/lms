export const updateRoleToEducator = async (req, res) => {
    try {
      const userId = req.auth.userId;
  
      // If user isn't authenticated, return a 401 error
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
      }
  
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: "educator",
        },
      });
  
      res.json({
        success: true,
        message: "User role updated to educator. You can publish a course now.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success:false, message: "Failed to update user role" });
    }
  };