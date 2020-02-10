--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

-- Started on 2020-02-10 21:57:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16426)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 16413)
-- Name: messages; Type: TABLE; Schema: public; Owner: shohei
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text text NOT NULL,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user1 uuid NOT NULL,
    user2 uuid NOT NULL
);


ALTER TABLE public.messages OWNER TO shohei;

--
-- TOC entry 203 (class 1259 OID 16395)
-- Name: session; Type: TABLE; Schema: public; Owner: shohei
--

CREATE TABLE public.session (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    latitude numeric(9,6) NOT NULL,
    name text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    longitude numeric(9,6) NOT NULL
);


ALTER TABLE public.session OWNER TO shohei;

--
-- TOC entry 2709 (class 2606 OID 16420)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: shohei
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 2707 (class 2606 OID 16404)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: shohei
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id, "timestamp");


-- Completed on 2020-02-10 21:57:22

--
-- PostgreSQL database dump complete
--

