import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Routes } from "react-router-dom";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Demos from "./pages/Demos";
import Docs from "./pages/Docs";
import Home from "./pages/Home";
import Innovation from "./pages/Innovation";
import NotFound from "./pages/NotFound";
import Partners from "./pages/Partners";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Product from "./pages/Product";
import { Profile } from "./pages/Profile";
import Terms from "./pages/Terms";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </TooltipProvider>
);

export default App;
