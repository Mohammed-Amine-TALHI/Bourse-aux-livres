import { Link } from "react-router-dom";
import { Badge, useTitle } from "../components/ui";

const STACK = ["React 18", "React Router 6", "Laravel 10", "JWT authentication", "MySQL", "REST API"];

const About = () => {
  useTitle("About");

  return (
    <>
      <div className="container page-head">
        <span className="eyebrow">About</span>
        <h1>A marketplace made by students, for students</h1>
      </div>

      <div className="container section-tight">
        <div className="prose">
          <p>
            <em>Bourse aux livres</em> is the French name for a book swap: at the end of every school year, students
            pass on the textbooks they no longer need to the class below. This website brings that tradition online.
          </p>
          <p>
            Sellers list their books in a couple of minutes. Each listing is reviewed by an administrator before it is
            published, and buyers contact the seller directly to arrange a hand-to-hand exchange on campus. No fees, no
            shipping, no middleman.
          </p>
          <p>
            The project started as a first full-stack application at EMINES - School of Industrial Management (UM6P):
            a React single-page app talking to a Laravel REST API.
          </p>
          <div className="stack">
            {STACK.map((item) => (
              <Badge key={item} tone="neutral" plain>
                {item}
              </Badge>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
            <Link to="/books" className="btn btn-primary">
              Browse books
            </Link>
            <Link to="/add-book" className="btn btn-outline">
              Sell a book
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
