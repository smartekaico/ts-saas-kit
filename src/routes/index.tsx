import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Loader } from "~/components/Loader";
import { Button } from "~/components/ui/button";
import { useConvexAuth } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export const Route = createFileRoute("/")({
  component: Home,
  pendingComponent: () => <Loader />,
});

function Home() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl text-primary">HomeNuvo</span>
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="border bg-background hover:bg-accent hover:text-accent-foreground">
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/login"
                      onClick={() => {
                        // This is a placeholder for actual sign out logic
                        // You would implement actual auth provider sign out here
                        console.log("User signed out");
                        // After sign out, redirect to login page happens via the Link
                      }}
                    >
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-16 text-center bg-gradient-to-b from-white to-slate-50">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900">
          AI Interior Redesign in Seconds
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your room photo and let HomeNuvo AI instantly generate stunning
          new interior designs tailored to your style.
        </p>
        <Button className="text-lg px-8 py-4" asChild>
          <Link to="/dashboard">Try it now</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border p-6 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-2">🖼️</span>
              <h3 className="font-semibold text-lg mb-2">Easy Image Upload</h3>
              <p className="text-gray-500">
                Drag & drop or select your interior photo to get started.
              </p>
            </div>
            <div className="rounded-xl border p-6 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-2">🎨</span>
              <h3 className="font-semibold text-lg mb-2">
                AI-Powered Redesigns
              </h3>
              <p className="text-gray-500">
                Choose styles or enter prompts to guide the AI transformation.
              </p>
            </div>
            <div className="rounded-xl border p-6 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-2">💾</span>
              <h3 className="font-semibold text-lg mb-2">Save & Download</h3>
              <p className="text-gray-500">
                Download your favorite designs or save them to your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-white">
              <h4 className="font-semibold mb-2">How does HomeNuvo AI work?</h4>
              <p className="text-gray-600">
                We use advanced AI models to analyze your uploaded room photo
                and generate new interior designs based on your selected style
                or prompt.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-white">
              <h4 className="font-semibold mb-2">Is it free to use?</h4>
              <p className="text-gray-600">
                You can try the redesign feature for free. Sign up to save your
                projects and access more styles.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-white">
              <h4 className="font-semibold mb-2">
                Can I download the AI-generated images?
              </h4>
              <p className="text-gray-600">
                Yes! Download any design you love or save it to your account for
                later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t bg-white text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} HomeNuvo. All rights reserved.
      </footer>
    </div>
  );
}
