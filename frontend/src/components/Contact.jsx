import React from 'react';

function Contact() {
    return (
        <section id="form">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="section-title-resume"><h2>Contact me!</h2></div>
                        <form action="/form.php" method="post"
                              className="p-4 border rounded shadow bg-light" encType="multipart/form-data">
                            <div className="mb-3">
                                <label htmlFor="full-name" className="form-label">Full Name:</label>
                                <input type="text" id="full-name" name="name" className="form-control"
                                       required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address:</label>
                                <input type="email" id="email" name="email" className="form-control"
                                       required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Message:</label>
                                <textarea id="message" name="message" className="form-control" rows="5"
                                          required></textarea>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="rounded-button-red">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;