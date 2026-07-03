import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Zones from './pages/Zones'
import Characters from './pages/Characters'
import Features from './pages/Features'
import Lore from './pages/Lore'
import Races from './pages/Races'
import Raids from './pages/Raids'
import MythicPlus from './pages/MythicPlus'
import Quests from './pages/Quests'
import Delves from './pages/Delves'
import Addons from './pages/Addons'
import Expansions from './pages/Expansions'
import WoWToken from './pages/WoWToken'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="zones" element={<Zones />} />
        <Route path="characters" element={<Characters />} />
        <Route path="features" element={<Features />} />
        <Route path="lore" element={<Lore />} />
        <Route path="races" element={<Races />} />
        <Route path="raids" element={<Raids />} />
        <Route path="mythic-plus" element={<MythicPlus />} />
        <Route path="quests" element={<Quests />} />
        <Route path="delves" element={<Delves />} />
        <Route path="addons" element={<Addons />} />
        <Route path="expansions" element={<Expansions />} />
        <Route path="wow-token" element={<WoWToken />} />
      </Route>
    </Routes>
  )
}
