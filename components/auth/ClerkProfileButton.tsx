'use client';

import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function ClerkProfileButton() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          Sign In
        </Button>
      </SignInButton>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-white/80 text-sm hidden sm:inline">
        {user?.firstName || user?.emailAddresses[0]?.emailAddress}
      </span>
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          }
        }}
      />
    </div>
  );
} 