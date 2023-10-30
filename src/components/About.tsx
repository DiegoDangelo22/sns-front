import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const About = () => {
    return (
        <div className="flex h-full bg-gray-900 items-center justify-center">
            <div className="bg-gray-100 w-3/6 rounded">
                <h1 className="text-5xl p-4 text-center">About this app</h1>
                <div className="mx-auto w-fit">
                        <div className="mx-auto w-fit text-center mb-4">
                            <p>Esto es una red social con las siguientes funcionalidades:</p>
                        </div>
                        <ul>
                            <li className="flex gap-4 items-center"><FontAwesomeIcon icon={faCheck} style={{color: "#23f13d",}} />Buscar, agregar y eliminar amigos</li>
                            <li className="flex gap-4 items-center"><FontAwesomeIcon icon={faCheck} style={{color: "#23f13d",}} />Ver publicaciones sólo de amigos</li>
                            <li className="flex gap-4 items-center"><FontAwesomeIcon icon={faCheck} style={{color: "#23f13d",}} />Subir imagenes y videos en las publicaciones</li>
                            <li className="flex gap-4 items-center"><FontAwesomeIcon icon={faCheck} style={{color: "#23f13d",}} />Chat privado con cada amigo</li>
                            <li className="flex gap-4 items-center"><FontAwesomeIcon icon={faCheck} style={{color: "#23f13d",}} />Menciones en publicaciones con el tag de un usuario</li>
                            <li className="flex gap-4 items-center"><FontAwesomeIcon icon={faCheck} style={{color: "#23f13d",}} />Ver perfiles de otros usuarios</li>
                        </ul>
                </div>
                <div className="flex items-center justify-center whitespace-pre-wrap p-4">
                    <p>Author: </p>
                    <a href="https://github.com/DiegoDangelo22" target="_blank" className="gap-1 uppercase font-bold inline-flex text-lg">
                        <p style={{color: '#fcc838'}}>D</p><p style={{color: '#2c8fe6'}}>i</p><p style={{color: '#f760ca'}}>e</p><p style={{color: '#39ed69'}}>g</p><p style={{color: '#ed3954'}}>o</p>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default About