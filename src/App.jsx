import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import ActorSheet from './components/ActorSheet';

export default function App() {
  const [searchVal, setSearchVal] = useState('');
  const [actorId, setActorId] = useState(null);
  const [actorSheetOpen, setActorSheetOpen] = useState(false);
  const [apiKeyUpdated, setApiKeyUpdated] = useState(false);

  const handleOpenActorSheet = (id) => {
    setActorId(id);
    setActorSheetOpen(true);
  };

  const handleKeyChange = () => {
    setApiKeyUpdated(prev => !prev);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <Header 
          searchVal={searchVal}
          onSearchChange={setSearchVal}
        />

        {/* Main Section */}
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  searchQuery={searchVal} 
                  key={`${searchVal}-${apiKeyUpdated}`} 
                />
              } 
            />
            <Route 
              path="/movies/:id" 
              element={
                <MovieDetails 
                  onOpenActorSheet={handleOpenActorSheet} 
                />
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Actor Info Side Drawer Sheet */}
        <ActorSheet 
          actorId={actorId}
          isOpen={actorSheetOpen}
          onClose={() => setActorSheetOpen(false)}
        />

      </div>
    </Router>
  );
}
