'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Camera, Map, User, Heart, MessageCircle, Share2, Bookmark, Search, Bell, Menu, Calendar, Clock } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const events = [
{ 
  id: 1, 
  name: "Neon Dreams", 
  rating: 4.5, 
  location: "Electric Avenue, Downtown", 
  image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1950&q=80", 
  likes: 1024, 
  comments: 89,
  emblem: "https://i.pravatar.cc/150?img=1",
  media: [
    { type: 'image', url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1950&q=80" },
    { type: 'video', url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { type: 'image', url: "https://images.unsplash.com/photo-1542628682-88321d2a4828?auto=format&fit=crop&w=1950&q=80" },
  ],
  position: [2, 0, 2]
},
{ 
  id: 2, 
  name: "Midnight Masquerade", 
  rating: 4.8, 
  location: "Enigma Club, Uptown", 
  image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1950&q=80", 
  likes: 1503, 
  comments: 124,
  emblem: "https://i.pravatar.cc/150?img=2",
  media: [
    { type: 'image', url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1950&q=80" },
    { type: 'image', url: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=1950&q=80" },
  ],
  position: [-2, 0, -2]
},
{ 
  id: 3, 
  name: "Retro Disco Fever", 
  rating: 4.2, 
  location: "Groovy Lounge, Midtown", 
  image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1950&q=80", 
  likes: 872, 
  comments: 56,
  emblem: "https://i.pravatar.cc/150?img=3",
  media: [
    { type: 'video', url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { type: 'image', url: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1950&q=80" },
  ],
  position: [2, 0, -2]
},
]

const initialUserProfile = {
name: "Alex Nightowl",
avatar: "https://i.pravatar.cc/150?img=68",
parties: 42,
friends: ["Zoe", "Mike", "Sarah", "Tom"],
customParties: []
}

function RatingBar({ rating }) {
const percentage = (rating / 5) * 100
const barColor = `hsl(${percentage * 1.2}, 100%, 50%)`

return (
  <div className="flex items-center space-x-2">
    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: barColor
        }}
      />
    </div>
    <span className="font-semibold text-sm text-gray-300">{rating.toFixed(1)}</span>
  </div>
)
}

function CityMap({ events }) {
  const gridSize = 10
  const buildingCount = 50

  const buildings = useRef([])
  const roads = useRef([])

  useEffect(() => {
    buildings.current = Array(buildingCount).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * gridSize,
        Math.random() * 2 + 0.5,
        (Math.random() - 0.5) * gridSize
      ],
      scale: [
        Math.random() * 0.5 + 0.5,
        Math.random() * 3 + 1,
        Math.random() * 0.5 + 0.5
      ],
      color: Math.random() > 0.8 ? '#ff00ff' : '#1a1a1a'
    }))

    roads.current = [
      { start: [-gridSize/2, 0, 0], end: [gridSize/2, 0, 0] },
      { start: [0, 0, -gridSize/2], end: [0, 0, gridSize/2] }
    ]
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box args={[gridSize, 0.1, gridSize]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#0a0a0a" />
      </Box>
      {buildings.current.map((building, index) => (
        <Box key={index} position={building.position} scale={building.scale}>
          <meshStandardMaterial color={building.color} />
        </Box>
      ))}
      {roads.current.map((road, index) => (
        <line key={index}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attachObject={['attributes', 'position']}
              array={new Float32Array([...road.start, ...road.end])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#ffffff" linewidth={2} />
        </line>
      ))}
      {events.map((event, index) => (
        <group key={index} position={event.position}>
          <Sphere args={[0.2, 32, 32]}>
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
          </Sphere>
          <Text
            position={[0, 1, 0]}
            color="#ffffff"
            fontSize={0.2}
            maxWidth={2}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="/fonts/Inter_Bold.json"
          >
            {event.name}
          </Text>
        </group>
      ))}
      <OrbitControls enableZoom={false} />
    </>
  )
}

export function Page() {
const [activeScreen, setActiveScreen] = useState('feed')
const [userProfile, setUserProfile] = useState(initialUserProfile)
const [newPost, setNewPost] = useState('')
const [showCreateParty, setShowCreateParty] = useState(false)
const [newParty, setNewParty] = useState({ name: '', date: '', time: '', location: '', description: '' })
const fileInputRef = useRef(null)

const handleCreateParty = () => {
  if (newParty.name && newParty.date && newParty.time && newParty.location) {
    setUserProfile(prev => ({
      ...prev,
      customParties: [...prev.customParties, { ...newParty, id: Date.now() }]
    }))
    setNewParty({ name: '', date: '', time: '', location: '', description: '' })
    setShowCreateParty(false)
  }
}

const renderHeader = () => (
  <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-purple-500">NightOwl</h1>
    <div className="flex space-x-4">
      <Button variant="ghost" size="icon">
        <Search className="h-5 w-5 text-gray-400" />
      </Button>
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5 text-gray-400" />
      </Button>
      <Button variant="ghost" size="icon">
        <Menu className="h-5 w-5 text-gray-400" />
      </Button>
    </div>
  </header>
)

const renderFeed = () => (
  <div className="max-w-xl mx-auto">
    <Card className="mb-4 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Share Your Night</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Avatar>
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{userProfile.name}</span>
        </div>
        <Textarea
          placeholder="How's the party scene tonight?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="mb-4 bg-gray-700 text-white border-gray-600"
        />
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-purple-400 border-purple-400">
            <Camera className="mr-2 h-4 w-4" /> Photo/Video
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Post</Button>
        </div>
      </CardContent>
    </Card>
    {events.map(event => (
      <Card key={event.id} className="mb-4 bg-gray-800 text-white">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Avatar className="mr-2 cursor-pointer">
                  <AvatarImage src={event.emblem} alt={event.name} />
                  <AvatarFallback>{event.name[0]}</AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
                <DialogHeader>
                  <DialogTitle>{event.name} Media</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="images" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger value="images" className="text-white data-[state=active]:bg-purple-600">Images</TabsTrigger>
                    <TabsTrigger value="videos" className="text-white data-[state=active]:bg-purple-600">Videos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="images">
                    <div className="grid grid-cols-2 gap-2">
                      {event.media.filter(item => item.type === 'image').map((item, index) => (
                        <img key={index} src={item.url} alt={`${event.name} image ${index + 1}`} className="w-full h-40 object-cover rounded" />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="videos">
                    <div className="grid grid-cols-1 gap-2">
                      {event.media.filter(item => item.type === 'video').map((item, index) => (
                        <video key={index} src={item.url} controls className="w-full rounded" />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <div>
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-gray-400">{event.location}</p>
            </div>
          </div>
          <img src={event.image} alt={event.name} className="w-full h-64 object-cover rounded-md mb-4" />
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-pink-400">
                <Heart className="mr-1 h-4 w-4" /> {event.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-400">
                <MessageCircle className="mr-1 h-4 w-4" /> {event.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-green-400">
                <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-yellow-400">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <RatingBar rating={event.rating} />
            <span className="text-gray-400 text-sm">({Math.floor(Math.random() * 1000)} reviews)</span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const renderMap = () => (
  <div className="h-screen w-full bg-gray-900">
    <Canvas>
      <CityMap events={events} />
    </Canvas>
  </div>
)

const renderProfile = () => (
  <div className="max-w-xl mx-auto p-4">
    <div className="bg-gray-800 rounded-lg shadow p-6 mb-4 text-white">
      <div className="flex items-center mb-4">
        <Avatar className="w-24 h-24 mr-4">
          <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
          <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{userProfile.name}</h2>
          <p className="text-gray-400">Parties: {userProfile.parties} | Friends: {userProfile.friends.length}</p>
        </div>
      </div>
      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-4">Edit Profile</Button>
      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowCreateParty(true)}>Create Custom Party</Button>
    </div>
    <Card className="bg-gray-800 text-white mb-4">
      <CardHeader>
        <CardTitle>Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {userProfile.friends.map((friend, index) => (
            <div key={index} className="text-center">
              <Avatar className="mx-auto mb-2">
                <AvatarFallback>{friend[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm">{friend}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Your Custom Parties</CardTitle>
      </CardHeader>
      <CardContent>
        {userProfile.customParties.length === 0 ? (
          <p className="text-gray-400">You haven't created any custom parties yet.</p>
        ) : (
          <div className="space-y-4">
            {userProfile.customParties.map((party) => (
              <div key={party.id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{party.name}</h3>
                <p className="text-sm text-gray-300 flex items-center mb-1"><Calendar className="mr-2 h-4 w-4" />{party.date}</p>
                <p className="text-sm text-gray-300 flex items-center mb-1"><Clock className="mr-2 h-4 w-4" />{party.time}</p>
                <p className="text-sm text-gray-300 flex items-center mb-1"><MapPin className="mr-2 h-4 w-4" />{party.location}</p>
                {party.description && <p className="text-sm text-gray-300 mt-2">{party.description}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
)

const renderCreateParty = () => (
  <Dialog open={showCreateParty} onOpenChange={setShowCreateParty}>
    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
      <DialogHeader>
        <DialogTitle>Create Custom Party</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="name" className="text-right">Name</label>
          <Input id="name" value={newParty.name} onChange={(e) => setNewParty({...newParty, name: e.target.value})} className="col-span-3 bg-gray-800 text-white" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="date" className="text-right">Date</label>
          <Input id="date" type="date" value={newParty.date} onChange={(e) => setNewParty({...newParty, date: e.target.value})} className="col-span-3 bg-gray-800 text-white" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="time" className="text-right">Time</label>
          <Input id="time" type="time" value={newParty.time} onChange={(e) => setNewParty({...newParty, time: e.target.value})} className="col-span-3 bg-gray-800 text-white" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="location" className="text-right">Location</label>
          <Input id="location" value={newParty.location} onChange={(e) => setNewParty({...newParty, location: e.target.value})} className="col-span-3 bg-gray-800 text-white" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="description" className="text-right">Description</label>
          <Textarea id="description" value={newParty.description} onChange={(e) => setNewParty({...newParty, description: e.target.value})} className="col-span-3 bg-gray-800 text-white" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleCreateParty} className="bg-purple-600 hover:bg-purple-700 text-white">Create Party</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

const renderContent = () => {
  switch (activeScreen) {
    case 'feed':
      return renderFeed()
    case 'map':
      return renderMap()
    case 'profile':
      return renderProfile()
    default:
      return renderFeed()
  }
}

return (
  <div className="min-h-screen bg-black text-white">
    {renderHeader()}
    <main className="pt-4 pb-16">
      {renderContent()}
    </main>
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
      <div className="flex justify-around py-2">
        <Button variant="ghost" className={activeScreen === 'feed' ? 'text-purple-500' : 'text-gray-400'} onClick={() => setActiveScreen('feed')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </Button>
        <Button variant="ghost" className={activeScreen === 'map' ? 'text-purple-500' : 'text-gray-400'} onClick={() => setActiveScreen('map')}>
          <Map className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className={activeScreen === 'profile' ? 'text-purple-500' : 'text-gray-400'} onClick={() => setActiveScreen('profile')}>
          <User className="h-6 w-6" />
        </Button>
      </div>
    </nav>
    {renderCreateParty()}
  </div>
)
}