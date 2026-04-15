
import './team.scss';
import Tyler from '../../../../public/Tyler.jpg';
import Prayan from '../../../../public/Prayan 1.jpeg';
import Kelly from '../../../../public/Kellie 2.jpg';
import Arjun from '../../../../public/Arjun.jpg';
import Image from 'next/image';
import Link from 'next/link';
const team_details = [
    {
        name: "Prayan",
        picture: Prayan,
        linkedin: "#"
    },
    {
        name: "Tyler",
        picture: Tyler,
        linkedin: "#"
    },
    {
        name: "Arjun",
        picture: Arjun,
        linkedin: "#"
    },
    {
        name: "Kellie",
        picture: Kelly,
        linkedin: "#"
    }
]

export default function Team() {
    return (
        <div className='team-section'>
            <h1>Team</h1>
            <div className='logo-design'>
                {team_details.map((member) => (
                    <div className='member' key={member.name}>
                        <Link href={member.linkedin} aria-label={member.name}>
                            <div className='avatar'>
                                <Image className='avatar-img' src={member.picture} alt={member.name} fill />
                            </div>
                        </Link>
                        <p>{member.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
