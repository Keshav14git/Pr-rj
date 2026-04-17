import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import {
  GripVertical, Plus, Trash2, Building2, MapPin,
  Calendar, ChevronDown, ChevronRight, ImagePlus,
  FolderOpen, X, Loader2,
} from 'lucide-react';

interface ProjectObj {
    _id?: string;
    name: string;
    location: string;
    images: string[];
}

interface Experience {
    _id?: string;
    company: string;
    role: string;
    duration: string;
    location: string;
    responsibilities: string[];
    projects: ProjectObj[];
    order: number;
}

const ExperienceDB = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchExperiences();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const fetchExperiences = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/portfolio/experiences');
            const data = await res.json();
            if (data.success) setExperiences(data.data);
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = async () => {
        const newExp = {
            company: 'New Company',
            role: 'Role Title',
            duration: '2024 - Present',
            location: 'Location',
            responsibilities: ['Responsibility 1'],
            projects: [],
            order: experiences.length
        };

        try {
            const res = await fetch('http://localhost:5000/api/portfolio/experiences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(newExp)
            });
            const data = await res.json();
            if (data.success) fetchExperiences();
        } catch (error) {
            alert('Failed to create new experience');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this experience entry?")) return;
        try {
            await fetch(`http://localhost:5000/api/portfolio/experiences/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            fetchExperiences();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleUpdate = async (id: string, updatedData: Partial<Experience>) => {
        const prevExps = [...experiences];
        setExperiences(experiences.map(exp => exp._id === id ? { ...exp, ...updatedData } : exp));

        try {
            await fetch(`http://localhost:5000/api/portfolio/experiences/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(updatedData)
            });
        } catch (error) {
            alert('Failed to update. Reverting.');
            setExperiences(prevExps);
            fetchExperiences();
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(experiences);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({ ...item, order: index }));
        setExperiences(updatedItems);

        const payload = updatedItems.map(item => ({ _id: item._id, order: item.order }));
        try {
            await fetch('http://localhost:5000/api/portfolio/experiences/reorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ items: payload })
            });
        } catch (error) {
            alert('Failed to save order. Reverting.');
            fetchExperiences();
        }
    };

    const handleImageUpload = async (expId: string, projectId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadKey = `${expId}-${projectId}`;
        setUploadingImage(uploadKey);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('http://localhost:5000/api/portfolio/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                const expToUpdate = experiences.find(exp => exp._id === expId);
                if (expToUpdate) {
                    const clonedProjects = [...expToUpdate.projects];
                    clonedProjects[projectId] = { ...clonedProjects[projectId], images: [...clonedProjects[projectId].images, data.url] };
                    await handleUpdate(expId, { projects: clonedProjects });
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert("Upload failed.");
        } finally {
            setUploadingImage(null);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 gap-3">
                <Loader2 size={18} className="animate-spin text-gray-400" />
                <p className="text-sm text-gray-400">Loading experiences...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col h-full font-sans overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Building2 size={16} className="text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Experience Timeline</h2>
                        <p className="text-xs text-gray-400">{experiences.length} entries · Drag to reorder</p>
                    </div>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-xs font-bold hover:bg-gray-800 transition-none cursor-pointer"
                >
                    <Plus size={14} />
                    Add Entry
                </button>
            </div>

            {/* Draggable List */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="experiences">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-3">
                                {experiences.map((exp, index) => {
                                    const isExpanded = expandedIds.has(exp._id || '');
                                    return (
                                        <Draggable key={exp._id} draggableId={exp._id as string} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`bg-white border transition-none ${
                                                        snapshot.isDragging ? 'shadow-md border-gray-900 border-2 rounded-lg' : 'border-gray-200 border-b-2 hover:border-gray-300 rounded-lg'
                                                    }`}
                                                >
                                                    {/* ── Card Header ── */}
                                                    <div className="flex items-center gap-3 px-4 py-4">
                                                        {/* Drag Handle */}
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="w-8 h-8 rounded shrink-0 flex items-center justify-center cursor-grab hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-none"
                                                        >
                                                            <GripVertical size={16} />
                                                        </div>

                                                        {/* Order Badge */}
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                                            {index + 1}
                                                        </div>

                                                        {/* Company / Role */}
                                                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                                                            <input
                                                                type="text"
                                                                value={exp.company}
                                                                onChange={(e) => handleUpdate(exp._id!, { company: e.target.value })}
                                                                className="bg-transparent border-none outline-none font-semibold text-sm text-gray-900 placeholder:text-gray-300 min-w-0"
                                                                placeholder="Company Name"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={exp.role}
                                                                onChange={(e) => handleUpdate(exp._id!, { role: e.target.value })}
                                                                className="bg-transparent border-none outline-none text-sm text-gray-500 placeholder:text-gray-300 min-w-0"
                                                                placeholder="Job Title"
                                                            />
                                                        </div>

                                                        {/* Meta pills */}
                                                        <div className="hidden lg:flex items-center gap-2 shrink-0">
                                                            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded">
                                                                <Calendar size={11} className="text-gray-500" />
                                                                <input
                                                                    type="text"
                                                                    value={exp.duration}
                                                                    onChange={(e) => handleUpdate(exp._id!, { duration: e.target.value })}
                                                                    className="bg-transparent border-none outline-none min-w-[130px] font-medium text-xs text-gray-700 placeholder:text-gray-400"
                                                                    placeholder="Duration"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded">
                                                                <MapPin size={11} className="text-gray-500" />
                                                                <input
                                                                    type="text"
                                                                    value={exp.location}
                                                                    onChange={(e) => handleUpdate(exp._id!, { location: e.target.value })}
                                                                    className="bg-transparent border-none outline-none w-20 font-medium text-xs text-gray-700 placeholder:text-gray-400"
                                                                    placeholder="Location"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Expand / Delete */}
                                                        <button
                                                            onClick={() => toggleExpand(exp._id!)}
                                                            className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-none cursor-pointer shrink-0"
                                                        >
                                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(exp._id!)}
                                                            className="w-8 h-8 rounded flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-600 transition-none cursor-pointer shrink-0"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    {/* ── Expanded Content ── */}
                                                    {isExpanded && (
                                                        <div className="px-5 pb-5 pt-1 border-t border-gray-100 ml-[72px]">
                                                            {/* Mobile: Duration/Location */}
                                                            <div className="flex lg:hidden items-center gap-3 mb-4">
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                                    <Calendar size={12} />
                                                                    <input type="text" value={exp.duration} onChange={(e) => handleUpdate(exp._id!, { duration: e.target.value })} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 min-w-[130px] text-xs text-gray-500 outline-none" />
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                                    <MapPin size={12} />
                                                                    <input type="text" value={exp.location} onChange={(e) => handleUpdate(exp._id!, { location: e.target.value })} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 w-24 text-xs text-gray-500 outline-none" />
                                                                </div>
                                                            </div>

                                                            {/* Responsibilities */}
                                                            <div className="mb-6 bg-gray-50 p-4 border border-gray-200 rounded-lg">
                                                                <label className="text-[11px] font-bold text-gray-600 mb-2 block uppercase tracking-wider">Responsibilities</label>
                                                                <textarea
                                                                    value={exp.responsibilities.join('\n')}
                                                                    onChange={(e) => handleUpdate(exp._id!, { responsibilities: e.target.value.split('\n') })}
                                                                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-gray-900 text-[13px] font-medium leading-relaxed focus:outline-none focus:border-gray-900 transition-none h-48 resize-y shadow-sm"
                                                                    placeholder="Enter responsibilities here (one per line)..."
                                                                />
                                                            </div>

                                                            {/* Projects */}
                                                            <div>
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <FolderOpen size={14} className="text-gray-500" />
                                                                        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Projects ({exp.projects.length})</label>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleUpdate(exp._id!, { projects: [...exp.projects, { name: 'New Project', location: 'Location', images: [] }] })}
                                                                        className="text-[11px] flex items-center gap-1 px-3 py-1.5 rounded border border-gray-200 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 transition-none cursor-pointer font-bold shadow-sm"
                                                                    >
                                                                        <Plus size={12} />
                                                                        Add Project
                                                                    </button>
                                                                </div>

                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                                    {exp.projects.map((proj, pIdx) => (
                                                                        <div key={pIdx} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                                                            <div className="flex justify-between items-start mb-3">
                                                                                <div className="flex flex-col gap-1 flex-1 mr-2">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={proj.name}
                                                                                        onChange={(e) => {
                                                                                            const c = [...exp.projects];
                                                                                            c[pIdx].name = e.target.value;
                                                                                            handleUpdate(exp._id!, { projects: c });
                                                                                        }}
                                                                                        className="bg-transparent font-bold text-[13px] text-gray-900 outline-none border-b border-transparent focus:border-gray-900 transition-none"
                                                                                        placeholder="Project name"
                                                                                    />
                                                                                    <div className="flex items-center gap-1 mt-0.5">
                                                                                        <MapPin size={10} className="text-gray-400" />
                                                                                        <input
                                                                                            type="text"
                                                                                            value={proj.location}
                                                                                            onChange={(e) => {
                                                                                                const c = [...exp.projects];
                                                                                                c[pIdx].location = e.target.value;
                                                                                                handleUpdate(exp._id!, { projects: c });
                                                                                            }}
                                                                                            className="bg-transparent font-medium text-[11px] text-gray-500 outline-none border-b border-transparent focus:border-gray-900 transition-none"
                                                                                            placeholder="Location"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const cloned = exp.projects.filter((_, idx) => idx !== pIdx);
                                                                                            handleUpdate(exp._id!, { projects: cloned });
                                                                                        }}
                                                                                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-none cursor-pointer"
                                                                                    >
                                                                                    <X size={13} />
                                                                                </button>
                                                                            </div>

                                                                            {/* Images */}
                                                                            <div className="flex flex-wrap gap-2 mb-2 mt-1">
                                                                                {proj.images.map((img, iIdx) => (
                                                                                    <div key={iIdx} className="relative group w-14 h-14 rounded border border-gray-200 overflow-hidden bg-gray-50">
                                                                                        <img src={img} alt="Asset" className="w-full h-full object-cover" />
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                const c = [...exp.projects];
                                                                                                c[pIdx].images = c[pIdx].images.filter((_, idx) => idx !== iIdx);
                                                                                                handleUpdate(exp._id!, { projects: c });
                                                                                            }}
                                                                                            className="absolute top-1 right-1 w-5 h-5 bg-white text-gray-500 hover:text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-none cursor-pointer rounded shadow-sm border border-gray-200"
                                                                                        >
                                                                                            <Trash2 size={10} />
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>

                                                                            <label className="border border-dashed border-gray-300 rounded w-full p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-none group">
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    onChange={(e) => handleImageUpload(exp._id!, pIdx, e)}
                                                                                    className="hidden"
                                                                                />
                                                                                {uploadingImage === `${exp._id}-${pIdx}` ? (
                                                                                    <span className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                                                                                        <Loader2 size={13} className="animate-spin" />
                                                                                        Uploading...
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="flex items-center gap-2 text-[11px] text-gray-500 group-hover:text-gray-900 font-bold uppercase tracking-wider">
                                                                                        <ImagePlus size={14} />
                                                                                        Upload Image
                                                                                    </span>
                                                                                )}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default ExperienceDB;
