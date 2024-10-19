--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2024-10-19 15:08:32

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
-- TOC entry 842 (class 1247 OID 797693)
-- Name: enum_items_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_items_type AS ENUM (
    'file',
    'folder'
);


ALTER TYPE public.enum_items_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 797697)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_id uuid,
    name character varying(255) NOT NULL,
    type public.enum_items_type NOT NULL,
    size integer,
    path text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 797715)
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    user_id uuid NOT NULL,
    acc_token text,
    ref_token text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 797683)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3339 (class 0 OID 797697)
-- Dependencies: 215
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, user_id, parent_id, name, type, size, path, "createdAt", "updatedAt", "deletedAt") FROM stdin;
c1cb3103-e9a0-4132-8962-29b8abbfd1fe	b9e8901e-4a9b-43a8-9ed4-79c9910835e6	\N	root	folder	\N	D:\\tes teknikal kerja\\invokes\\db\\uploads\\b9e8901e-4a9b-43a8-9ed4-79c9910835e6	2024-10-19 14:14:54.262+07	2024-10-19 14:14:54.262+07	\N
73517f23-1a52-4c3d-960b-57270aa06b73	b9e8901e-4a9b-43a8-9ed4-79c9910835e6	c1cb3103-e9a0-4132-8962-29b8abbfd1fe	Halo	folder	0	D:\\tes teknikal kerja\\invokes\\db\\uploads\\b9e8901e-4a9b-43a8-9ed4-79c9910835e6\\Halo	2024-10-19 14:15:04.535+07	2024-10-19 14:15:04.535+07	\N
430d75ac-875d-4aee-8f8b-9a6d689e937b	b9e8901e-4a9b-43a8-9ed4-79c9910835e6	c1cb3103-e9a0-4132-8962-29b8abbfd1fe	Hi	folder	0	D:\\tes teknikal kerja\\invokes\\db\\uploads\\b9e8901e-4a9b-43a8-9ed4-79c9910835e6\\Hi	2024-10-19 14:15:11.126+07	2024-10-19 14:15:11.126+07	\N
52957a22-1813-4581-87ba-029de015c28d	b9e8901e-4a9b-43a8-9ed4-79c9910835e6	73517f23-1a52-4c3d-960b-57270aa06b73	Keren.txt	file	0	D:\\tes teknikal kerja\\invokes\\db\\uploads\\b9e8901e-4a9b-43a8-9ed4-79c9910835e6\\Halo\\Keren.txt	2024-10-19 14:15:19.772+07	2024-10-19 14:15:19.772+07	\N
\.


--
-- TOC entry 3340 (class 0 OID 797715)
-- Dependencies: 216
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens (user_id, acc_token, ref_token, "createdAt", "updatedAt", "deletedAt") FROM stdin;
b9e8901e-4a9b-43a8-9ed4-79c9910835e6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjllODkwMWUtNGE5Yi00M2E4LTllZDQtNzljOTkxMDgzNWU2IiwiZW1haWwiOiJoYWZpaWh6YTgzNEBnbWFpbC5jb20iLCJpYXQiOjE3MjkzMjIwOTQsImV4cCI6MTczMTkxNDA5NH0.Tsw5jmFJbOlSTQHKKD34Buzq3fn-BV2c6fRhuF7pjDM	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjllODkwMWUtNGE5Yi00M2E4LTllZDQtNzljOTkxMDgzNWU2IiwiZW1haWwiOiJoYWZpaWh6YTgzNEBnbWFpbC5jb20iLCJpYXQiOjE3MjkzMjIwOTQsImV4cCI6MTczMTkxNDA5NH0.9yrJrT3dJw-uYHO1OA6OUcb_-U8t-vEstXFOJ7kICkI	2024-10-19 14:14:54.16+07	2024-10-19 14:14:54.16+07	\N
\.


--
-- TOC entry 3338 (class 0 OID 797683)
-- Dependencies: 214
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password, username, "createdAt", "updatedAt", "deletedAt") FROM stdin;
b9e8901e-4a9b-43a8-9ed4-79c9910835e6	hafiihza834@gmail.com	Hafi Ihza Farhana	$2b$10$PIhdP8MvM9lS5Bz2YAS1h.TLAh2bq4xZtLaEVLGdsKGvkWzPanGD2	hafiihza834	2024-10-19 14:14:54.058+07	2024-10-19 14:14:54.058+07	\N
\.


--
-- TOC entry 3188 (class 2606 OID 797703)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 797721)
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3185 (class 2606 OID 797689)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3189 (class 1259 OID 797714)
-- Name: items_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX items_user_id ON public.items USING btree (user_id);


--
-- TOC entry 3190 (class 1259 OID 797727)
-- Name: tokens_acc_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tokens_acc_token ON public.tokens USING btree (acc_token);


--
-- TOC entry 3183 (class 1259 OID 797690)
-- Name: users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email ON public.users USING btree (email);


--
-- TOC entry 3186 (class 1259 OID 797691)
-- Name: users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username ON public.users USING btree (username);


--
-- TOC entry 3193 (class 2606 OID 797709)
-- Name: items items_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.items(id) ON DELETE CASCADE;


--
-- TOC entry 3194 (class 2606 OID 797704)
-- Name: items items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3195 (class 2606 OID 797722)
-- Name: tokens tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-10-19 15:08:37

--
-- PostgreSQL database dump complete
--

