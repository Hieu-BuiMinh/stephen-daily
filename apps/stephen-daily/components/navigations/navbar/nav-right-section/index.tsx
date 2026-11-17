import { ModeToggle } from '@/components/buttons/mode-toggle'
import NavbarWeather from './navbar-weather'

function NavRightSection() {
	return (
		<div className="hidden md:flex flex-col gap-1 h-full text-xs relative border-l border-dashed pl-2 pr-8">
			<NavbarWeather />
			<ModeToggle className="absolute right-0 -top-2" />
		</div>
	)
}

export default NavRightSection
